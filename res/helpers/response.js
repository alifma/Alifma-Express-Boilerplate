// Export Semua Method
module.exports = {
    // Kalau Tidak ada Error
    success: (res, rescode, message, pagination, arr) => {
        res.json({
            code: rescode,
            msg: message,
            pagination,
            data: arr,
        })
    },

    // Kalau ada error
    error: (res, rescode, message, sysMsg, arr) => {
        res.json({
            code: rescode,
            msg: message,
            data: {
                errorMsg: sysMsg
            },
            pagination: arr
        })
    },

    // Kalau tidak ketemu routenya
    notFound: (res, message) => {
        res.json({
            code: 404,
            msg: message,
        })
    }

}