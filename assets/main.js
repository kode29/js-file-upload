const dropArea = document.querySelector(".drop-section")
const listSection = document.querySelector('.list-section')
const listContainer = document.querySelector('.list')
const fileSelector = document.querySelector('.file-selector')
const fileSelectorInput = document.querySelector('.file-selector-input')

// upload files with browse button
fileSelector.onclick = () => fileSelectorInput.click()
fileSelectorInput.onchange = () => {
    [...fileSelectorInput.files].forEach((file) => {
        if(typeValidation(file.type)){
            // console.log(file);
            uploadFile(file)
        }
    })
}

// when file is over the drag area
dropArea.ondragover = (e) => {
    e.preventDefault();
    [...e.dataTransfer.items].forEach((item) => {
        if(typeValidation(item.type)) {
            dropArea.classList.add("drag-over-effect")
        }
    })
}
// when file leaves the drag area
dropArea.ondragleave = () => {
    dropArea.classList.remove('drag-over-effect')
}

// when file drop on the drag area
dropArea.ondrop = (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over-effect')
    if (e.dataTransfer.items){
        [...e.dataTransfer.items].forEach((item) => {
            if(item.kind === 'file'){
                const file = item.getAsFile();
                if (typeValidation(file.type)){
                    uploadFile(file);
                }
            }
        })
    } else {
        [...e.dataTransfer.files].forEach((file) => {
            if(typeValidation(file.type)) {
                uploadFile(file);
            }
        })
    }
}

// check file type
function typeValidation (type) {
    let splitType = type.split("/")[0]
    if (type == 'application/pdf'
        || splitType == 'image'
        || splitType == 'video'
    ) {
        return true
    } else {
        console.log(`Hey! ${type} is not an accepted file for this demo`)
    }
}


// upload file function
function uploadFile(file) {
    // do uploading
    // console.log(file);
    listSection.style.display = 'block'
    let li = document.createElement('li');
    li.classList.add('in-prog')
    li.innerHTML = `
    <div class="col">
        <img src="assets/icons/${iconSelector(file.type)}" alt="">
    </div>
    <div class="col">
        <div class="file-name">
            <div class="name">${file.name}</div>
            <span></span>
        </div>
        <div class="file-progress">
            <span></span>
        </div>
        <div class="file-size">${(file.size/(1024*1024)).toFixed(2)} MB</div>
    </div>
    <div class="col">
        <svg class="cross" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 384 512"> <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
        <svg class="tick" xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
    </div>
    `
    listContainer.prepend(li)
    let http = new XMLHttpRequest()
    let data = new FormData();
    data.append('file', file)
    http.onload = () => {
        li.classList.add('complete')
        li.classList.remove('in-prog')
    }
    http.upload.onprogress = (e) => {
        let percent_complete = (e.loaded / e.total)*100
        // console.log(percent_complete)
        li.querySelectorAll('span')[0].innerHTML = Math.round(percent_complete) + "%"
        li.querySelectorAll('span')[1].style.width = percent_complete + '%'
    }
    http.open('POST', 'assets/sender.php', true);
    http.send(data);
    li.querySelector('.cross').onclick = () => http.abort()
    http.onabort = () => li.remove()
}

function iconSelector(type) {
    let splitType = (type.split("/")[0] == "application" ? type.split('/')[1] : type.split('/')[0])
    return splitType+".svg"
}