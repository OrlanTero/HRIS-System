import {Ajax, GetNumsOfYear} from "../component/Tool.js";

const __HOSTNAME = "";

export function AddRecord(target, data) {
    return new Promise((resolve, reject) => {
        Ajax({
            url:  `${__HOSTNAME}/api/admin/${target}/addRecord`,
            type: "POST",
            data: data,
            success: (data) => {
                console.log(data)
                resolve(JSON.parse(data));
            },
            error: (e) => {
                console.log(e)
                reject(e.message)
            }
        });
    })
}

export function EditRecord(target, data) {
    return new Promise((resolve, reject) => {
        Ajax({
            url: `${__HOSTNAME}/api/admin/${target}/editRecord`,
            type: "POST",
            data: data,
            success: (data) => {
                console.log(data)
                resolve(JSON.parse(data))
            },
            error: reject
        });
    })
}

export function RemoveRecord(target, data) {
    return new Promise((resolve, reject) => {
        Ajax({
            url: `${__HOSTNAME}/api/admin/${target}/removeRecord`,
            type: "POST",
            data: data,
            success: (data) => {
                console.log(data)
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                }
            },
            error: reject
        });
    })
}

export function RemoveRecords(target, data = []) {
    return Promise.all(data.map((id) => RemoveRecord(target, id)));
}

export function RemoveRecordsBatch(target, data = []) {
    return new Promise((resolve, reject) => {
        Ajax({
            url: `${__HOSTNAME}/api/admin/${target}/removeRecords`,
            type: "POST",
            data: data,
            success: (data) => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                }
            },
            error: reject
        });
    })
}

export function EditRecords(target, data = []) {
    return Promise.all(data.map((da) => EditRecord(target, da)));
}

export function UpdateRecords(target, forUser) {
    return new Promise((resolve, reject) => {
        Ajax({
            url: `${__HOSTNAME}/api/admin/${target}/updateRecords`,
            type: "POST",
            data: {forUser},
            success: (data) => resolve(data),
            error: reject
        });
    })
}

export function SearchRecords(target, search, filter, forUser) {
    return new Promise((resolve, reject) => {
        Ajax({
            url: `${__HOSTNAME}/api/admin/${target}/searchRecords`,
            type: "POST",
            data: {search, filter, forUser},
            success: (data) => resolve(data),
            error: reject
        });
    })
}

export function FilterRecords(target, data) {
    return new Promise((resolve, reject) => {
        Ajax({
            url: `${__HOSTNAME}/api/admin/${target}/filterRecords`,
            type: "POST",
            data: data,
            success: (data) => resolve(data),
            error: reject,
        });
    })
}

export function PostContainerRequest(target,file, data) {
    return new Promise((resolve, reject) => {
        Ajax({
            url: `${__HOSTNAME}/components/containers/${target}/${file}`,
            type: "POST",
            data: data,
            success: (data) => resolve(data),
            error: reject,
        });
    })
}

export function UploadImageFromBase64(base64, filename, destination) {
    return new Promise((resolve, reject) => {
        Ajax({
            url: __HOSTNAME  + "/tool/uploadImageFromBase64",
            type: "POST",
            data: {base64, filename, destination},
            success: (res) => resolve(JSON.parse(res)),
            error: reject,
        });
    });
}

export function UploadImageFromFile(file, filename, destination) {
    return new Promise((resolve, reject) => {
        Ajax({
            url:  __HOSTNAME  +"/tool/UploadFileFromFile",
            type: "POST",
            data: {file, filename, destination},
            success: (res) => {
                try {
                    resolve(JSON.parse(res))
                } catch (e) {
                    reject(e.message);
                }
            },
            error: reject,
        });
    });
}

export function UploadFileFromFile(file, filename, destination) {
    return new Promise((resolve, reject) => {
        Ajax({
            url:  __HOSTNAME  +"/tool/UploadFileFromFile",
            type: "POST",
            data: {file, filename, destination},
            success: (res) => {
                console.log(res);
                resolve(JSON.parse(res))
            },
            error: reject,
        });
    });
}

export function UploadImageFromPath(path, filename, destination) {
    return new Promise((resolve, reject) => {
        Ajax({
            url:  __HOSTNAME  +"/tool/uploadImageFromPath",
            type: "POST",
            data: {path, filename, destination},
            success: (res) => resolve(JSON.parse(res)),
            error: reject,
        });
    });
}


export function GetApplicationData() {
    return new Promise((resolve, reject) => {
        Ajax({
            url:  __HOSTNAME  +"/api/admin/getApplicationData",
            type: "POST",
            success: (res) => resolve(JSON.parse(res)),
            error: reject,
        });
    });
}

export function SearchUsers(search, userType) {
    return new Promise((resolve, reject) => {
        Ajax({
            url:  __HOSTNAME  +`/api/global/searchUsers`,
            type: "POST",
            data: {search, userType},
            success: (data) => resolve(data),
            error: reject
        });
    })
}

export function ResponseToRecord(target, id, response) {
    return new Promise((resolve, reject) => {
        Ajax({
            url: `${__HOSTNAME}/api/admin/${target}/responseToRecord`,
            type: "POST",
            data: {id, response: JSON.stringify(response)},
            success: (data) => {
                console.log(data)
                resolve(JSON.parse(data))
            },
            error: reject,
        });
    })
}



export function GetPeriodOfAYear(year) {
    const periods = [];
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July ',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    for (let i = 1; i < 13; i++) {
        const days = GetNumsOfYear(year, i);
        const month = months[i - 1];

        periods.push(`${month} 1 to 15`);
        periods.push(`${month} 16 to ${days}`);

        if (i === 12) {
            periods.push(`13th Month 1 to 15`);
            periods.push(`13th Month 16 to ${days}`);
        }
    }

    return periods;
}

