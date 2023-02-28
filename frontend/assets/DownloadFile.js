/**
 * A function for downloading files, instead of opening them in a new tab
 * @param  {Blob} response The response containing the file to be downloaded
 * @param  {String} fallbackFileName A fallback name for the file, in case it doesn't exist in the response headers
 * @param  {Function} callback An optional callback function
 */
export function downloadFile (response, fallbackFileName, callback) {
    let finalFileName = fallbackFileName || 'file'
    const resHeaders = response.headers
    // Check if the Content-Disposition header exists
    if (resHeaders['content-disposition']) {
        // If it does, it should contain the file name
        const fileName = resHeaders['content-disposition']?.split('=')[1]
        if (fileName) {
            finalFileName = fileName
        }
    }

    // Create an anchor element, append it to the body & don't display it
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.style.display = 'none'
    // Create the download URL for the Blob we got as a response
    const url = window.URL.createObjectURL(response.data)
    // Set the href of the anchor element to the URL
    a.href = url
    // Set the download attribute of the anchor element to the file name
    a.download = finalFileName.trim()
    // Synthetically click the anchor element
    a.click()
    // Remove the previously created URL from the window object
    window.URL.revokeObjectURL(url)
    // Remove the anchor element
    a.remove()

    if (callback) {
        callback()
    }
}
