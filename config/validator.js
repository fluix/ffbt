function vendor(vendorContents) {
    if (vendorContents) {
        if (Array.isArray(vendorContents)) {
            return vendorContents.length > 0;
        }
        return true;
    }

    return false;
}

module.exports = {
    vendor
};
