const admin = (req, res, next) => {
    if (!req.user.roles.includes("admin")) return res.status(403).send({
        ok: false,
        error:"Access denied"
    });
    next();
}

const editor = (req, res, next) => {
    if (!req.user.roles.includes("editor")) return res.status(403).send({
        ok: false,
        error:"Access denied"
    });
    next();
}

const viewer = (req, res, next) => {
    console.log('role',req.user.roles.includes("viewer"))
    if (!req.user.roles.includes("viewer")) return res.status(403).send({
        ok: false,
        error:"Access denied"
    });
    next();
}



module.export = { admin, editor, viewer }; 
