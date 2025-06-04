
var am
function JobBook (io,serviceType, location, time){
am=io
console.log("che",io);
    // // Find an available vendor
    // const availableVendor = vendors.find(vendor => vendor.available);
    // if (availableVendor) {
    //     // Assign service to the vendor
    //     availableVendor.available = false;

    //     // Notify vendor
    //     const vendorTimeout = setTimeout(() => {
    //         availableVendor.available = true; // Make vendor available again
    //         res.status(500).json({ message: `Vendor ${availableVendor.name} did not respond in time` });
    //     }, VENDOR_ASSIGNMENT_TIMEOUT);

        io.emit(`vendor:${123}:alert`, { serviceType, location, time });

        // res.status(200).json({ message: `Service booked successfully with ${availableVendor.name}` });
    // } else {
    //     res.status(500).json({ message: 'No available vendors' });
    // }
}
console.log("Amit",am);
module.exports={JobBook}