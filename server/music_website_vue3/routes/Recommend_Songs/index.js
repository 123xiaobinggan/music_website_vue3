const express = require('express')
const router = express.Router();
const { connectDB } = require('../../db.js')


async function main(req, context) {
    // 简单直接，足够应对大部分场景
    const res = await connectDB(
        'SELECT * FROM Songs ORDER BY RAND() LIMIT 30'
    );
    if (res.length > 0) {
        const songs = res
        console.log(songs)
        return {
            code: 0,
            data: {
                ...songs
            }
        }
    } else {
        return {
            code: 1,
            msg: '获取歌曲失败'
        }
    }
}

router.post('/', async (req, res) => {
    console.log('收到请求Recomment_Songs', req.body);
    try {
        const result = await main(req, {});
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
