module.exports = [
    { url: /^\/$/, controller: "commonController", action: "index" },
    { url: /^\/login\/?$/, controller: "userController", action: "login" },
    { url: /^\/verificationCode$/, controller: "userController", action: "getVerificationCode" },
    { url: /^\/checkVerificationCode$/, controller: "userController", action: "checkVerificationCode" },
    { url: /^\/getUserInfo$/, controller: "userController", action: "getUserInfo" },
    { url: /^\/changePhoto$/, controller: "userController", action: "changePhoto" },
    { url: /^\/getShortcuts$/, controller: "folderController", action: "getShortcuts" },
    { url: /^\/getDisks$/, controller: "diskController", action: "getDisks" },
    { url: /^\/getOtherNavs$/, controller: "commonController", action: "getOtherNavs" },
    { url: /^\/getFolderInfo$/, controller: "folderController", action: "getFolderInfo" },
    { url: /^\/getFiles$/, controller: "folderController", action: "getFiles" }
]