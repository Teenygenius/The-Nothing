import mongoose from 'mongoose';

// In-memory data structures
const users: any[] = [];
const sessions: any[] = [];
const notifications: any[] = [];

// Helper to generate Mongo-like ObjectIds
export const generateId = () => new mongoose.Types.ObjectId();

function wrapQuery(doc: any) {
  let result = doc;
  const queryObj: any = {
    select: function (fields: string) {
      if (result && fields.includes('-password')) {
        const copy = { ...result };
        delete copy.password;
        result = copy;
      }
      return this;
    },
    populate: function () {
      return this;
    },
    then: function (resolve: any, reject: any) {
      return Promise.resolve(result).then(resolve, reject);
    },
  };
  return queryObj;
}

// Helper to add mongoose document methods (like .save())
function createMongooseDoc(target: any, sourceArray: any[]) {
  const doc = { ...target };

  doc.save = async function () {
    const idx = sourceArray.findIndex(item => item._id.toString() === this._id.toString());
    if (idx !== -1) {
      sourceArray[idx] = { ...this };
    }
    return this;
  };

  return doc;
}

// Memory User Model
export const MemoryUser = {
  findOne: (query: { email?: string; _id?: any }) => {
    const user = users.find(u => {
      if (query.email && u.email === query.email.toLowerCase()) return true;
      if (query._id && u._id.toString() === query._id.toString()) return true;
      return false;
    });
    return wrapQuery(user ? createMongooseDoc(user, users) : null);
  },

  findById: (id: any) => {
    const user = users.find(u => u._id.toString() === id.toString());
    return wrapQuery(user ? createMongooseDoc(user, users) : null);
  },

  create: async (data: any) => {
    const newUser = {
      _id: generateId(),
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      avatar: data.avatar || 'sloth',
      nothingSessions: data.nothingSessions || 0,
      totalNothingTime: data.totalNothingTime || 0,
      level: data.level || 1,
      settings: data.settings || {
        theme: 'dark',
        notificationsEnabled: true,
        achievementNotifications: true,
        sessionNotifications: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(newUser);
    return createMongooseDoc(newUser, users);
  },

  findByIdAndDelete: async (id: any) => {
    const index = users.findIndex(u => u._id.toString() === id.toString());
    if (index === -1) return null;
    const removed = users.splice(index, 1)[0];
    return removed;
  },
};

// Memory NothingSession Model
export const MemoryNothingSession = {
  create: async (data: any) => {
    const newSession = {
      _id: generateId(),
      userId: data.userId,
      startTime: data.startTime || new Date(),
      endTime: data.endTime || new Date(),
      duration: data.duration || 0,
      humorMessage: data.humorMessage || 'Nothing completed successfully.',
      createdAt: new Date(),
    };
    sessions.push(newSession);
    return newSession;
  },

  find: (query: { userId?: any }) => {
    let result = sessions.filter(s => {
      if (query.userId) {
        return s.userId.toString() === query.userId.toString();
      }
      return true;
    });

    const queryObj: any = {
      _data: [...result],
      sort: function (_sortObj: any) {
        this._data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return this;
      },
      skip: function (n: number) {
        this._data = this._data.slice(n);
        return this;
      },
      limit: function (n: number) {
        this._data = this._data.slice(0, n);
        return this;
      },
      then: function (resolve: any, reject: any) {
        return Promise.resolve(this._data).then(resolve, reject);
      },
    };
    return queryObj;
  },

  findOne: (query: { userId?: any }) => {
    let result = sessions.filter(s => {
      if (query.userId) {
        return s.userId.toString() === query.userId.toString();
      }
      return true;
    });

    const queryObj: any = {
      _data: [...result],
      sort: function (sortObj: any) {
        if (sortObj && sortObj.duration === -1) {
          this._data.sort((a: any, b: any) => b.duration - a.duration);
        } else {
          this._data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        return this;
      },
      select: function () {
        return this;
      },
      then: function (resolve: any, reject: any) {
        return Promise.resolve(this._data[0] || null).then(resolve, reject);
      },
    };
    return queryObj;
  },

  countDocuments: async (query: { userId?: any }) => {
    return sessions.filter(s => s.userId.toString() === query.userId.toString()).length;
  },

  deleteMany: async (query: { userId?: any }) => {
    const before = sessions.length;
    for (let i = sessions.length - 1; i >= 0; i--) {
      if (sessions[i].userId.toString() === query.userId.toString()) {
        sessions.splice(i, 1);
      }
    }
    return { deletedCount: before - sessions.length };
  },

  aggregate: async (pipeline: any[]) => {
    let userSessions = [...sessions];

    // Find userId match
    const matchStage = pipeline.find(p => p.$match);
    if (matchStage) {
      const { userId, createdAt } = matchStage.$match;
      if (userId) {
        userSessions = userSessions.filter(s => s.userId.toString() === userId.toString());
      }
      if (createdAt && createdAt.$gte) {
        const gteTime = new Date(createdAt.$gte).getTime();
        userSessions = userSessions.filter(s => new Date(s.createdAt).getTime() >= gteTime);
      }
    }

    // Check if grouping by date string (daily)
    const groupStage = pipeline.find(p => p.$group);
    if (groupStage) {
      const format = groupStage.$group?._id?.$dateToString?.format;

      if (format === '%Y-%m-%d') {
        const groups: Record<string, any> = {};
        for (const s of userSessions) {
          const d = new Date(s.createdAt).toISOString().split('T')[0];
          if (!groups[d]) {
            groups[d] = {
              _id: d,
              sessions: 0,
              totalDurationSeconds: 0,
              durations: [] as number[],
            };
          }
          groups[d].sessions += 1;
          groups[d].totalDurationSeconds += s.duration;
          groups[d].durations.push(s.duration);
        }

        return Object.values(groups).map((g: any) => ({
          _id: g._id,
          sessions: g.sessions,
          totalDurationSeconds: g.totalDurationSeconds,
          avgDurationSeconds: g.totalDurationSeconds / g.sessions,
          maxDurationSeconds: Math.max(...g.durations),
        }));
      }

      // Check if grouping for today stats (null _id)
      if (groupStage.$group._id === null) {
        if (userSessions.length === 0) return [];
        const totalDuration = userSessions.reduce((sum, s) => sum + s.duration, 0);
        return [
          {
            _id: null,
            count: userSessions.length,
            totalDuration,
          },
        ];
      }

      // Check if dayOfWeek
      if (groupStage.$group._id?.$dayOfWeek) {
        const groups: Record<number, any> = {};
        for (const s of userSessions) {
          const day = new Date(s.createdAt).getDay() + 1; // 1-7
          if (!groups[day]) {
            groups[day] = { _id: day, sessions: 0, totalDuration: 0 };
          }
          groups[day].sessions += 1;
          groups[day].totalDuration += s.duration;
        }
        return Object.values(groups);
      }

      // Check if monthly
      if (format === '%Y-%m') {
        const groups: Record<string, any> = {};
        for (const s of userSessions) {
          const m = new Date(s.createdAt).toISOString().substring(0, 7);
          if (!groups[m]) {
            groups[m] = { _id: m, sessions: 0, totalDuration: 0 };
          }
          groups[m].sessions += 1;
          groups[m].totalDuration += s.duration;
        }
        return Object.values(groups);
      }
    }

    return userSessions;
  },
};

// Memory Notification Model
export const MemoryNotification = {
  create: async (data: any) => {
    const newNotif = {
      _id: generateId(),
      userId: data.userId,
      message: data.message,
      type: data.type || 'session',
      read: data.read || false,
      createdAt: new Date(),
    };
    notifications.push(newNotif);
    return newNotif;
  },

  insertMany: async (items: any[]) => {
    const created = items.map(data => ({
      _id: generateId(),
      userId: data.userId,
      message: data.message,
      type: data.type || 'session',
      read: data.read || false,
      createdAt: new Date(),
    }));
    notifications.push(...created);
    return created;
  },

  find: (query: { userId?: any }) => {
    let result = notifications.filter(n => {
      if (query.userId) {
        return n.userId.toString() === query.userId.toString();
      }
      return true;
    });

    const queryObj: any = {
      _data: [...result],
      sort: function (_sortObj: any) {
        this._data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return this;
      },
      limit: function (n: number) {
        this._data = this._data.slice(0, n);
        return this;
      },
      then: function (resolve: any, reject: any) {
        return Promise.resolve(this._data).then(resolve, reject);
      },
    };
    return queryObj;
  },

  countDocuments: async (query: { userId?: any; read?: boolean }) => {
    return notifications.filter(n => {
      if (query.userId && n.userId.toString() !== query.userId.toString()) return false;
      if (query.read !== undefined && n.read !== query.read) return false;
      return true;
    }).length;
  },

  findOneAndUpdate: async (query: { _id?: any; userId?: any }, update: { read?: boolean }) => {
    const notif = notifications.find(
      n => n._id.toString() === query._id.toString() && n.userId.toString() === query.userId.toString()
    );
    if (!notif) return null;
    if (update.read !== undefined) notif.read = update.read;
    return notif;
  },

  updateMany: async (query: { userId?: any; read?: boolean }, update: { read?: boolean }) => {
    let count = 0;
    for (const notif of notifications) {
      if (query.userId && notif.userId.toString() !== query.userId.toString()) continue;
      if (query.read !== undefined && notif.read !== query.read) continue;
      if (update.read !== undefined) notif.read = update.read;
      count++;
    }
    return { modifiedCount: count };
  },

  findOneAndDelete: async (query: { _id?: any; userId?: any }) => {
    const index = notifications.findIndex(
      n => n._id.toString() === query._id.toString() && n.userId.toString() === query.userId.toString()
    );
    if (index === -1) return null;
    return notifications.splice(index, 1)[0];
  },

  deleteMany: async (query: { userId?: any }) => {
    const before = notifications.length;
    for (let i = notifications.length - 1; i >= 0; i--) {
      if (notifications[i].userId.toString() === query.userId.toString()) {
        notifications.splice(i, 1);
      }
    }
    return { deletedCount: before - notifications.length };
  },
};
