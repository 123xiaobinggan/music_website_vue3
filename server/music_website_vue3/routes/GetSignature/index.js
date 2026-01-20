const express = require('express')
const router = express.Router()
const { connectDB } = require('../../db.js')
const COS = require('cos-nodejs-sdk-v5');

async function main(req, context) {
    const { accountId, filePath } = req.body;
    const cos = new COS({
        SecretId:"AKIDjU9wWyEH7mIdmjV4SddAWiiYCi9RYTBg",
        SecretKey: "SjrmnprjZIsGVXO1UlrjQwGTUIsENI2Y"
    })

    if(!accountId || !filePath){
        throw new Error('required params or filePath missing')
    }

    const key = filePath;

    try{
        const url = cos.getObjectUrl({
            Bucket: 'binggan-1358387153',
            Region: 'ap-guangzhou',
            Key: key,
            Sign: true,
            Method:'PUT',
            Expires: 60
        });
        console.log('url',url)
        return {
            url: url
        };
    }catch(err){
        console.log(err)
        return{
            url: ''
        }
    }
}

router.post('/', async (req, res) => {
    console.log('GetSignature', req.body)

    try {
        const result = await main(req, {})
        res.json(result)
    } catch (err) {
        console.error('登录失败:', err)
        res.status(500).json({
            code: 500,
            msg: '服务器内部错误'
        })
    }
})

module.exports = router
