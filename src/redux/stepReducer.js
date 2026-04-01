import vendor from './vendor'
import editVendor from './EditVendor'
import newVendor from './newVendor'
import permission from './permissionSlice'
import customVendor from './customVendorSlice'


const stepReducer = {
    vendor, editVendor, newVendor, permission, customVendor
}
export default stepReducer