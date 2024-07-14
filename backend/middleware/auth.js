import jwt from 'jsonwebtoken';

export const isAuthUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = await User.getUserInfomation(req, res, next);

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}