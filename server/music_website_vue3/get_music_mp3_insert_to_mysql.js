const COS = require('cos-nodejs-sdk-v5')
const { connectDB } = require('./db')
//https://binggan-1358387153.cos.ap-guangzhou.myqcloud.com/music_website_vue3_User/${this.user.accountId}.jpg
const cos = new COS({
    SecretId: "AKIDjU9wWyEH7mIdmjV4SddAWiiYCi9RYTBg",
    SecretKey: "SjrmnprjZIsGVXO1UlrjQwGTUIsENI2Y"
})

const Bucket = 'binggan-1358387153'
const Region = 'ap-guangzhou'
const Prefix = 'music_website_vue3_musicSource/' // 只扫描 music 目录

async function listAllObjects() {
    let marker = ''
    let files = []

    while (true) {
        const res = await cos.getBucket({
            Bucket,
            Region,
            Prefix,
            Marker: marker,
            MaxKeys: 1000
        })

        files = files.concat(res.Contents || [])

        if (res.IsTruncated === 'true') {
            marker = res.NextMarker
        } else {
            break
        }
    }

    return files
}

function isAudioFile(key) {
    return /\.(mp3|flac|wav|aac)$/i.test(key)
}

function buildAudioUrl(key) {
    return `https://${Bucket}.cos.${Region}.myqcloud.com/${key}`
}

async function sync() {
    const objects = await listAllObjects()

    for (const obj of objects) {
        const key = obj.Key

        if (!isAudioFile(key)) continue

        const audioUrl = buildAudioUrl(key)

        // 简单从文件名提取歌名
        const filename = key.split('/').pop()
        const { artist, title } = parseSongInfo(filename)

        const duration = await getAudioDuration(audioUrl)
        try {
            await connectDB(
                `INSERT INTO Songs (songKey,title,artist,audioUrl,album,coverUrl,duration,genre)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE audioUrl = VALUES(audioUrl)`,
                [key, title, artist, audioUrl, ' ', 'https://picsum.photos/200/200?random='+Math.floor(Math.random()*100), duration, 'rock']
            )

            console.log('已同步:', key)
        } catch (err) {
            console.error('同步失败:', key, err)
        }
    }

    console.log('🎵 音乐同步完成')
}

sync()

function parseSongInfo(filename) {
    // 去掉扩展名
    const name = filename.replace(/\.[^/.]+$/, '')

    // 按 " - " 分割
    const parts = name.split(' - ')

    if (parts.length >= 2) {
        return {
            artist: parts[0].trim(),
            title: parts.slice(1).join(' - ').trim()
        }
    }

    // 兜底：没有按规则命名
    return {
        artist: '未知歌手',
        title: name
    }
}

const ffmpeg = require('fluent-ffmpeg')

function getAudioDuration(url) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(url, (err, metadata) => {
            if (err) return reject(err)
            resolve(Math.floor(metadata.format.duration))
        })
    })
}
