

const getPagination = (req, DEFAULT_LIMIT = 15) => {

    const {page, limit} = req.query;
    
    if (page && page <= 0) {
        throw new Error("Page number must be greater than 0");
    }
    if (limit && limit <= 0) {
        throw new Error("Limit must be greater than 0");
    }

    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || DEFAULT_LIMIT;
    const finalLimit = parsedLimit > 0 && parsedLimit <= DEFAULT_LIMIT ? parsedLimit : DEFAULT_LIMIT;
    const skip = (parsedPage - 1) * finalLimit;

    return { limit : finalLimit, skip };
};


module.exports = {getPagination}