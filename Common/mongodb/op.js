'use strict';

let logSys = require('../log').logSys;

//obj===>string
let print = function (obj) {
    return obj;
};

let tr = function (str) {
    return '{' + str + '}';
};
/**
 *增
 */
function add(collectName, schema, model) {
    return new Promise(function (resolve, reject) {
        global.db.model(collectName, schema, collectName).create(model, function (err, result) {
            if (err) {
                let msg = 'mogodb add err.collectName=' + collectName + ',schema=' + schema + ',model=' + print(model) + ',err=' + err;
                logSys.warn(msg);
                reject(msg);
            } else {
                resolve(result);
            }
        });
    });
}

/**
 *删
 */
function del(collectName, schema, conditions) {
    let cond = JSON.parse(tr(conditions));
    return new Promise(function (resolve, reject) {
        global.db.model(collectName, schema, collectName).remove(cond, function (err, result) {
            if (err) {
                let msg = 'mogodb remove err.collectName=' + collectName + ',schema=' + schema + ',conditions=' + print(conditions) + ',err=' + err;
                logSys.warn(msg);
                reject(msg);
            } else {
                resolve(result);
            }
        });
    });
}

/**
 *改 sb('src/model/options',55)
 */
function update(collectName, schema, conditions, updates, options) {
    let cond = JSON.parse(tr(conditions));
    let update = JSON.parse(tr(updates));
    return new Promise(function (resolve, reject) {
        global.db.model(collectName, schema, collectName).update(cond, update, options, function (err, result) {
            if (err) {
                let msg = 'mogodb update err.collectName=' + collectName + ',schema=' + schema + 'conditions=' + print(conditions) + ',update=' + print(update) + ',options=' + print(options) + ",err=" + err;
                logSys.warn(msg);
                reject(msg);
            } else {
                resolve(result);
            }
        });
    });
}

/*
 *查
 */
function find(collectName, schema, conditions, field, options) {
    let cond = JSON.parse(tr(conditions));

    options = options ? options : { sort: [{ '_id': -1 }] };
    return new Promise(function (resolve, reject) {
        if (field) {
            global.db.model(collectName, schema, collectName).find(cond, field, options, function (err, result) {
                if (err) {
                    let msg = 'mogodb find err.collectName=' + collectName + ',schema=' + schema + ',conditions=' + print(conditions) + ',field=' + print(update) + ',options=' + print(options) + ",err=" + err;
                    logSys.warn(msg);
                    reject(msg);
                } else {
                    resolve(result);
                }
            });
        } else {
            global.db.model(collectName, schema, collectName).find(cond, '-createTime -modifyTime -__v', options, function (err, result) {
                if (err) {
                    let msg = 'mogodb find err.collectName=' + collectName + ',schema=' + schema + ',conditions=' + print(conditions) + ',field=' + print(update) + ',options=' + print(options) + ",err=" + err;
                    logSys.warn(msg);
                    reject(msg);
                } else {
                    resolve(result);
                }
            });
        }
    });
}

/*
 *查
 */
function popu(collectName, schema, conditions, field, popu, options, patterns, extra) {
    let cond = JSON.parse(tr(conditions));
    let pattern = JSON.parse(tr(conditions));

    options = options ? options : { sort: [{ '_id': -1 }] };
    if (!popu) {
        throw new Error('参数popu为null');
    }
    let popus = popu.split(',');
    return new Promise(function (resolve, reject) {
        if (field) {
            let findPromise = global.db.model(collectName, schema, collectName).find(cond, field, options);
            popus.forEach((po) => {
                if (!extra) {
                    findPromise.populate(po, '-createTime -modifyTime -__v');
                } else {
                    findPromise.populate(po, extra);
                }
            });

            findPromise.exec(function (err, result) {
                if (err) {
                    let msg = 'mogodb find err.collectName=' + collectName + ',schema=' + schema + ',conditions=' + print(conditions) + ',field=' + print(update) + ',options=' + print(options) + ",err=" + err;
                    logSys.warn(msg);
                    reject(msg);
                } else {
                    resolve(result);
                }
            });
        } else {
            let findPromise = global.db.model(collectName, schema, collectName).find(cond, '-__v -createTime -modifyTime', options);
            popus.forEach((po) => {
                if (!extra) {
                    findPromise.populate(po, '-createTime -modifyTime -__v');
                } else {
                    findPromise.populate(po, extra);
                }
            });

            findPromise.exec(function (err, result) {
                if (err) {
                    let msg = 'mogodb find err.collectName=' + collectName + ',schema=' + schema + ',conditions=' + print(conditions) + ',field=' + print(update) + ',options=' + print(options) + ",err=" + err;
                    logSys.warn(msg);
                    reject(msg);
                } else {
                    resolve(result);
                }
            });
        }
    });
}
/**
 *分页
 */
function page(collectName, schema, conditions, si, count, patterns, popu) {
    let cond = JSON.parse(tr(conditions));
    let pattern = JSON.parse(tr(patterns));

    let query = global.db.model(collectName, schema, collectName).find(cond);
    query.sort(pattern).skip(parseInt(si)).limit(parseInt(count));

    return new Promise(function (resolve, reject) {
        query.exec(function (err, result) {
            if (err) {
                let msg = 'mogodb page err.collectName=' + collectName + ',schema=' + schema + ',conditions=' + print(conditions) + ',field=' + print(update) + ',si=' + si + ',count=' + count + ',pattern=' + print(pattern) + ',err=' + err;
                logSys.warn(msg);
                reject(msg);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = {
    add: add,
    del: del,
    update: update,
    find: find,
    page: page,
    popu: popu
};
