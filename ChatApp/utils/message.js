var generateMessage = function(from,text){
    return {
        from,
        text,
        createdAt: new Date().toLocaleString()
    };
};
module.exports = {generateMessage};
