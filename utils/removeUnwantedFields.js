module.exports = function (user) {
    delete user.password; delete user.createdAt;
    delete user.updatedAt; delete user.__v;
    return user;
}