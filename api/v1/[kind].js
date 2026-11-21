import { blobInbox } from '../../server/blobInbox.js'
import { createRequestApi } from '../../server/requests.js'

export default createRequestApi(blobInbox)
