module.exports = (req) => req.session.token !== undefined && req.session.userid !== undefined && req.session.name !== undefined
