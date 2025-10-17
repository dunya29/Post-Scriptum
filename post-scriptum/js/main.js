let isIOS = checkIOS()
let isFirefox = typeof InstallTrigger !== 'undefined';
const preloader = document.querySelector(".preloader")
let preloaderHiddenTimeOut = 0
if (preloader) {
    preloaderHiddenTimeOut = 1400
    enableScroll()
    disableScroll()
    setTimeout(() => {
        preloader.classList.add('loaded');
        setTimeout(() => {
            enableScroll()
        }, 600);
    }, 1400);
}
const header = document.querySelector(".header")
const menuMobileBtn = document.querySelector('.menu-mobile__btn');
const menuOpenBtn = document.querySelector('.menu-open-btn');
const menuCloseBtn = document.querySelector('.menu-close-btn');
const mobMenu = document.querySelector(".header__mob-wrapper")
const modal = document.querySelectorAll(".modal")
const successModal = document.querySelector(".success-mod")
const errorModal = document.querySelector(".error-mod")
const dropdown = document.querySelectorAll(".dropdown")
let animSpd = 400
let bp = {
    largeDesktop: 1460.98,
    desktop: 1200.98,
    laptop: 1030.98,
    tablet: 767.98,
    phone: 600.98
}
//scroll pos
function scrollPos() {
    return window.scrollY || window.pageYOffset || document.documentElement.scrollTop
}
function checkIOS() {
    let platform = navigator.platform;
    let userAgent = navigator.userAgent;
    return (
        // iPhone, iPod, iPad
        /(iPhone|iPod|iPad)/i.test(platform) ||
        // iPad на iOS 13+
        (platform === 'MacIntel' && navigator.maxTouchPoints > 1 && !window.MSStream) ||
        // User agent проверка
        (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)
    );
}
//enable scroll
function enableScroll() {
    if (!document.querySelector(".modal.open")) {
        if (document.querySelectorAll(".fixed-block")) {
            document.querySelectorAll(".fixed-block").forEach(block => block.style.paddingRight = '0px')
        }
        document.body.style.paddingRight = '0px'
        document.body.classList.remove("no-scroll")
        // для IOS
        if (isIOS) {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            let scrollY = document.body.dataset.scrollY;
            window.scrollTo(0, parseInt(scrollY || '0'));
        }
    }
}
//disable scroll
function disableScroll() {
    if (!document.querySelector(".modal.open")) {
        let paddingValue = window.innerWidth > 350 ? window.innerWidth - document.documentElement.clientWidth + 'px' : 0
        if (document.querySelector(".fixed-block")) {
            document.querySelectorAll(".fixed-block").forEach(block => block.style.paddingRight = paddingValue)
        }
        document.body.style.paddingRight = paddingValue
        document.body.classList.add("no-scroll");
        // для IOS
        if (isIOS) {
            let scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${scrollY}px`;
            document.body.dataset.scrollY = scrollY;
        }
    }
}
//smoothdrop
function smoothDrop(header, body, dur = false) {
    let animDur = dur ? dur : 500
    body.style.overflow = 'hidden';
    body.style.transition = `height ${animDur}ms ease`;
    body.style['-webkit-transition'] = `height ${animDur}ms ease`;
    if (!header.classList.contains("active")) {
        header.parentNode.classList.add("active")
        body.style.display = 'block';
        let height = body.clientHeight + 'px';
        body.style.height = '0px';
        setTimeout(function () {
            body.style.height = height;
            setTimeout(() => {
                body.style.height = null
                header.classList.add("active")
            }, animDur);
        }, 0);
    } else {
        header.parentNode.classList.remove("active")
        let height = body.clientHeight + 'px';
        body.style.height = height
        setTimeout(function () {
            body.style.height = "0"
            setTimeout(() => {
                body.style.display = 'none';
                body.style.height = null
                header.classList.remove("active")
            }, animDur);
        }, 0);
    }
}
//tabSwitch
function tabSwitch(nav, block) {
    nav.forEach((item, idx) => {
        item.addEventListener("click", () => {
            nav.forEach(el => {
                el.classList.remove("active")
                el.setAttribute("aria-selected", false)
            })
            item.classList.add("active")
            item.setAttribute("aria-selected", true)
            block.forEach(el => {
                if (el.dataset.block === item.dataset.tab) {
                    if (!el.classList.contains("active")) {
                        el.classList.add("active")
                        el.style.opacity = "0"
                        setTimeout(() => {
                            el.style.opacity = "1"
                        }, 0);
                    }
                } else {
                    el.classList.remove("active")
                }
            })
        })
    });
}
// custom scroll FF
const customScroll = document.querySelectorAll(".custom-scroll")
if (isFirefox) {
    document.documentElement.style.scrollbarColor = "#231F20 transparent"
}
if (isFirefox && customScroll) {
    customScroll.forEach(item => { item.style.scrollbarWidth = "thin"; item.style.scrollbarColor = "#231F20 transparent" })
}
//anchor
const anchorLinks = document.querySelectorAll(".js-anchor")
if (anchorLinks.length) {
    anchorLinks.forEach(item => {
        item.addEventListener("click", e => {
            let idx = item.getAttribute("href").indexOf("#")
            const href = item.getAttribute("href").substring(idx)
            let dest = document.querySelector(href)
            if (dest) {
                e.preventDefault()
                let destPos = dest.getBoundingClientRect().top < 0 ? dest.getBoundingClientRect().top - header.clientHeight - 10 : dest.getBoundingClientRect().top - 10
                if (menuCloseBtn && mobMenu && mobMenu.classList.contains("show")) {
                    menuCloseBtn.click()
                    setTimeout(() => {
                        window.scrollTo({ top: scrollPos() + destPos, behavior: 'smooth' })
                    }, 300);
                } else {
                    window.scrollTo({ top: scrollPos() + destPos, behavior: 'smooth' })
                }
            }
        })
    })
}
//fixed header
let lastScroll = scrollPos();
window.addEventListener("scroll", () => {
    if (scrollPos() > 1) {
        header.classList.add("scroll")
        if (header.classList.contains("header--main")) {
            header.classList.remove("header--light")
        }
        if ((scrollPos() > lastScroll && scrollPos() > 150 && !header.classList.contains("unshow"))) {
            header.classList.add("unshow")
        } else if (scrollPos() < lastScroll && header.classList.contains("unshow")) {
            header.classList.remove("unshow")
        }
    } else {
        header.classList.remove("scroll")
        header.classList.remove("unshow")
        if (header.classList.contains("header--main")) {
            header.classList.add("header--light")
        }
    }
    lastScroll = scrollPos()
})
//switch active tab/block
const switchBlock = document.querySelectorAll(".switch-block")
if (switchBlock) {
    switchBlock.forEach(item => {
        tabSwitch(item.querySelectorAll("[data-tab]"), item.querySelectorAll("[data-block]"))
    })
}
//open modal
function openModal(modal) {
    let activeModal = document.querySelector(".modal.open")
    disableScroll()
    if (activeModal) {
        activeModal.classList.remove("open")
    }
    modal.classList.add("open")
}
//close modal
function closeModal(modal) {
    if (modal.querySelector("video")) {
        modal.querySelectorAll("video").forEach(item => item.pause())
    }
    modal.classList.remove("open")
    setTimeout(() => {
        enableScroll()
    }, animSpd);
}
// modal click outside
if (modal) {
    modal.forEach((mod) => {
        mod.addEventListener("click", (e) => {
            if (!mod.querySelector(".modal__content").contains(e.target)) {
                closeModal(mod);
            }
        });
        mod.querySelectorAll(".modal__close").forEach(btn => {
            btn.addEventListener("click", () => {
                closeModal(mod)
            })
        })
    });
}
// modal button on click
function modalShowBtns() {
    const modOpenBtn = document.querySelectorAll(".mod-open-btn")
    if (modOpenBtn.length) {
        modOpenBtn.forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault()
                let href = btn.getAttribute("data-modal")
                openModal(document.getElementById(href))
            })
        })
    }
}
modalShowBtns()
// modal close button on click
function modalUnshowBtns() {
    const modCloseBtn = document.querySelectorAll(".mod-close-btn")
    if (modCloseBtn.length) {
        modCloseBtn.forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault()
                let href = btn.getAttribute("data-modal")
                closeModal(document.getElementById(href))
            })
        })
    }
}
modalUnshowBtns()
//open dropdown
function openDropdown(item) {
    item.classList.add("open");
    item.querySelector(".dropdown__header").setAttribute("aria-expanded", true);
    item.querySelectorAll("label input").forEach(inp => {
        inp.addEventListener("change", (e) => {
            setActiveOption(item)
        });
    });
    document.addEventListener("click", function clickOutside(e) {
        if (!item.contains(e.target)) {
            closeDropdown(item)
            document.removeEventListener('click', clickOutside);
        }
    });
}
// set active option
function setActiveOption(item) {
    item.querySelector(".dropdown__header").classList.add("checked")
    if (item.classList.contains("radio-select")) {
        let activeInpTxt = item.querySelector("input:checked").nextElementSibling.innerHTML
        item.querySelector(".dropdown__header span").innerHTML = activeInpTxt
        closeDropdown(item)
    }
}
//close dropdonw
function closeDropdown(item) {
    item.classList.remove("open");
    item.querySelector(".dropdown__header").setAttribute("aria-expanded", false);
}
//dropdown
if (dropdown) {
    dropdown.forEach(item => {
        item.querySelector(".dropdown__header").addEventListener("click", () => {
            item.classList.contains("open") ? closeDropdown(item) : openDropdown(item)
        })
    })
}
//setSuccessTxt
function setSuccessTxt(title = false, txt = false) {
    successModal.querySelector(".modal__top .h2").innerHTML = title ? title : "Спасибо!<br>Мы получили вашу заявку."
    if (txt) {
        successModal.querySelector(".modal__top-txt").innerHTML = txt
    }
}
//setErrorTxt
function setErrorTxt(title = false, txt = false) {
    errorModal.querySelector(".modal__top .h2").innerHTML = title ? title : "Что-то пошло не так"
    if (txt) {
        errorModal.querySelector(".modal__top-txt").innerHTML = txt
    }
}
// openSuccessMod
function openSuccessMod(title = false, txt = false) {
    setSuccessTxt(title, txt)
    openModal(successModal)
}
// openErrorMod
function openErrorMod(title = false, txt = false) {
    setErrorTxt(title, txt)
    openModal(errorModal)
}
// formReset
function formReset(form) {
    if (form.querySelectorAll(".item-form").length > 0) {
        form.querySelectorAll(".item-form").forEach(item => item.classList.remove("error"))
    }
    if (form.querySelectorAll("[data-error]").length > 0) {
        form.querySelectorAll("[data-error]").forEach(item => item.textContent = '')
    }
    form.querySelectorAll("input").forEach(inp => {
        if (!["hidden", "checkbox", "radio"].includes(inp.type)) {
            inp.value = ""
        }
        if (["checkbox", "radio"].includes(inp.type) && !inp.classList.contains("required")) {
            inp.checked = false
            inp.setAttribute("aria-checked", "false")
        }
    })
    if (form.querySelector("textarea")) {
        form.querySelector("textarea").value = ""
    }
    if (form.querySelector(".file-form__items")) {
        form.querySelector(".file-form__items").innerHTML = ""
    }
}
//form remove error on input
const form = document.querySelectorAll(".form")
if (form.length) {
    form.forEach(item => {
        item.addEventListener("input", e => {
            const parent = e.target.closest(".item-form")
            if (parent) {
                parent.classList.remove("error")
            }
        })
        let inputs = item.querySelectorAll("input")
        if (inputs.length) {
            inputs.forEach(inp => {
                inp.addEventListener("change", () => {
                    if (inp.type === 'checkbox') {
                        inp.parentNode.setAttribute('aria-checked', inp.checked ? 'true' : 'false');
                    } else if (inp.type === 'radio') {
                        let inpName = inp.getAttribute("name")
                        item.querySelectorAll(`input[name='${inpName}']`).forEach(el => {
                            el.parentNode.setAttribute('aria-checked', 'false')
                            inp.parentNode.setAttribute('aria-checked', 'true');
                        })
                    }
                })
            })
        }
    })
}
//mask input
const inp = document.querySelectorAll('input[type=tel]')
if (inp) {
    inp.forEach(item => {
        Inputmask({ "mask": "+7 999 999-99-99" }).mask(item);
    })
}
//file-form
let allFileTypes = [
    { "extension": ".png", "mimeType": "image/png" },
    { "extension": [".jpg", ".jpeg"], "mimeType": "image/jpeg" },
    { "extension": ".gif", "mimeType": "image/gif" },
    { "extension": ".bmp", "mimeType": "image/bmp" },
    { "extension": ".txt", "mimeType": "text/plain" },
    { "extension": ".rtf", "mimeType": "application/rtf" },
    { "extension": [".ppt", ".pot", ".pps", ".ppa"], "mimeType": "application/vnd.ms-powerpoint" },
    { "extension": ".pptx", "mimeType": "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
    { "extension": ".odp", "mimeType": "application/vnd.oasis.opendocument.presentation" },
    { "extension": ".ods", "mimeType": "application/vnd.oasis.opendocument.spreadsheet" },
    { "extension": ".doc", "mimeType": "application/msword" },
    { "extension": ".docx", "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
    { "extension": ".pdf", "mimeType": "application/pdf" },
    { "extension": [".xls", ".xlt", ".xla", ".xlsb", ".xlsm", ".xltx", ".xltm"], "mimeType": "application/vnd.ms-excel" },
    { "extension": ".xlsx", "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    { "extension": ".odt", "mimeType": "application/vnd.oasis.opendocument.text" }
]
function addFile(files, item) {
    let maxSize = item.querySelector('input').getAttribute("data-max-size")
    let accept = item.querySelector('input').getAttribute("accept")
    let fileTypes = []
    if (accept) {
        let acceptArr = accept.split(",").map(item => item.trim().toLowerCase()).filter(item => item !== "");
        allFileTypes.forEach(type => {
            if (Array.isArray(type.extension)) {
                for (const ext of type.extension) {
                    if (acceptArr.includes(ext)) {
                        fileTypes.push(type.mimeType);
                        break;
                    }
                }
            } else if (typeof type.extension === 'string') {
                if (acceptArr.includes(type.extension)) {
                    fileTypes.push(type.mimeType);
                }
            }
        })
        accept = acceptArr.map(item => item.replace(/^\./, '')).join(", ")
    }
    for (let i = 0; i < files.length; i++) {
        let file = files[i]
        if (maxSize && file.size > maxSize * 1024 * 1024) {
            item.querySelector("input").value = ""
            item.classList.add("error")
            item.querySelectorAll(".file-form__item").forEach((el => el.remove()));
            item.querySelector("[data-error]").textContent = `Файл должен быть менее ${maxSize} МБ`
            return
        } else if (accept && fileTypes.length && !fileTypes.includes(file.type)) {
            item.querySelector("input").value = ""
            item.classList.add("error")
            item.querySelectorAll(".file-form__item").forEach((el => el.remove()));
            item.querySelector("[data-error]").textContent = `Разрешённые форматы: ${accept}`
            return
        } else {
            item.classList.remove("error")
            item.querySelector("[data-error]").textContent = ""
            let reader = new FileReader()
            reader.readAsDataURL(file);
            reader.onload = () => {
                item.querySelector(".file-form__items").insertAdjacentHTML("afterbegin", `<div class="file-form__item">
                        <div class="file-form__name">${file.name}</div>
                        <button type="button" class="btn-cross file-form__del"></button>
                    </div>`)
            }
            reader.onerror = () => {
                console.log(reader.error);
            }
        }
    }
}
if (document.querySelector(".file-form")) {
    document.querySelectorAll(".file-form").forEach(item => {
        item.querySelector("input").addEventListener("change", e => {
            item.querySelectorAll(".file-form__item").forEach((el => el.remove()));
            let files = e.target.files;
            addFile(files, item)
        })
        //delete file
        item.addEventListener("click", e => {
            item.querySelectorAll(".file-form__del").forEach((del, idx) => {
                if (del.contains(e.target)) {
                    const dt = new DataTransfer()
                    const input = item.querySelector("input")
                    const { files } = input
                    for (let i = 0; i < files.length; i++) {
                        let file = files[i]
                        if (i !== idx) {
                            dt.items.add(file)
                        }
                    }
                    input.files = dt.files
                    setTimeout(() => {
                        del.parentNode.remove()
                    }, 0);
                }
            })
        })
        item.addEventListener("dragenter", e => {
            e.preventDefault();
        })
        item.addEventListener("dragover", e => {
            e.preventDefault();
        })
        item.addEventListener("dragleave", e => {
            e.preventDefault();
        })
        item.addEventListener("drop", function (e) {
            e.preventDefault();
            const dt = new DataTransfer()
            dt.items.add(e.dataTransfer.files[0])
            let files = Array.from(dt.files)
            item.querySelector("input").files = dt.files
            item.querySelectorAll(".file-form__item").forEach((el => el.remove()));
            addFile(files, item)
        });
    })
}
//accordion
const accordion = document.querySelectorAll(".accordion")
if (accordion.length) {
    accordion.forEach(item => {
        item.querySelector(".accordion__header").addEventListener("click", () => {
            if (!item.classList.contains("no-close")) {
                item.parentNode.parentNode.querySelectorAll(".accordion").forEach(el => {
                    if (el.querySelector(".accordion__header").classList.contains("active")) {
                        smoothDrop(el.querySelector(".accordion__header"), el.querySelector(".accordion__body"))
                        if (el.getBoundingClientRect().top < 0) {
                            let pos = scrollPos() + item.getBoundingClientRect().top - el.querySelector(".accordion__body").clientHeight - header.clientHeight - 10
                            window.scrollTo(0, pos)
                        }
                    }
                })
            }
            smoothDrop(item.querySelector(".accordion__header"), item.querySelector(".accordion__body"))
        })
    })
}
//swiper 4 items
const swiper4 = document.querySelectorAll('.swiper-4')
if (swiper4.length) {
    swiper4.forEach(item => {
        let itemSwiper = new Swiper(item.querySelector(".swiper"), {
            slidesPerView: 1.19,
            spaceBetween: 10,
            observer: true,
            observeParents: true,
            watchSlidesProgress: true,
            pagination: {
                el: item.querySelector(".swiper-pagination"),
                type: "bullets",
                clickable: true,
            },
            navigation: {
                prevEl: item.querySelector(".nav-btn--prev"),
                nextEl: item.querySelector(".nav-btn--next"),
            },
            breakpoints: {
                1460.98: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                },
                1030.98: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
                767.98: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                },
                600.98: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                },
                480.98: {
                    slidesPerView: 1.6,
                    spaceBetween: 10,
                },
            },
            speed: 800,
        });
    })
}
//swiper 2 items
const swiper2 = document.querySelectorAll('.swiper-2')
if (swiper2.length) {
    swiper2.forEach(item => {
        let itemSwiper = new Swiper(item.querySelector(".swiper"), {
            slidesPerView: 1.19,
            spaceBetween: 10,
            observer: true,
            observeParents: true,
            watchSlidesProgress: true,
            pagination: {
                el: item.querySelector(".swiper-pagination"),
                type: "bullets",
                clickable: true,
            }, 
            navigation: {
                prevEl: item.querySelector(".nav-btn--prev"),
                nextEl: item.querySelector(".nav-btn--next"),
            },
            breakpoints: {
                1030.98: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                600.98: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                },
                480.98: {
                    slidesPerView: 1.6,
                    spaceBetween: 10,
                },
            },
            speed: 800,
        });
    })
}
//project swiper
const projectSwiper = document.querySelector('.project-p__swiper')
if (projectSwiper) {
    let thisSwiper
    let isInitialized
    function initProjectSwiper() {
        if (window.innerWidth >= bp.tablet && !isInitialized) {
            isInitialized = true
            thisSwiper = new Swiper(projectSwiper.querySelector('.swiper'), {
                slidesPerView: "auto",
                observer: true,
                observeParents: true,
                watchSlidesProgress: true,
                navigation: {
                    prevEl: projectSwiper.querySelector(".nav-btn--prev"),
                    nextEl: projectSwiper.querySelector(".nav-btn--next"),
                },
                speed: 800,
            });
        } else if (window.innerWidth < bp.tablet && isInitialized) {
            isInitialized = false
            thisSwiper.destroy()
        }
    }
    initProjectSwiper()
    window.addEventListener("resize", initProjectSwiper)
    projectSwiper.querySelectorAll('.swiper-slide img').forEach(img => {
        if (img.complete) {
            img.closest('.swiper-slide').classList.add('loaded');
        } else {
            img.addEventListener('load', function () {
                img.closest('.swiper-slide').classList.add('loaded');
            });
        }
    });
}
//team swiper
const teamSwiper = document.querySelector(".team .swiper")
if (teamSwiper) {
    let thisSwiper
    let isInitialized
    function initTeamSwiper() {
        if (window.innerWidth >= bp.largeDesktop && !isInitialized) {
            isInitialized = true
            thisSwiper = new Swiper(teamSwiper, {
                slidesPerView: 4,
                spaceBetween: 20,
                observer: true,
                observeParents: true,
                watchSlidesProgress: true,
                navigation: {
                    prevEl: document.querySelector(".team .nav-btn--prev"),
                    nextEl: document.querySelector(".team .nav-btn--next"),
                },
                speed: 800,
            });
        } else if (window.innerWidth < bp.largeDesktop && isInitialized) {
            isInitialized = false
            thisSwiper.destroy()
        }
    }
    initTeamSwiper()
    window.addEventListener("resize", initTeamSwiper)
}
//lazyload
function lazyLoad() {
    const lazyImg = document.querySelectorAll(".lazy-img img[loading=lazy]")
    if (lazyImg.length) {
        lazyImg.forEach(img => {
            const parent = img.closest('.lazy-img')
            if (img.complete) {
                parent.classList.add('loaded');
                img.removeAttribute('loading')
            } else {
                img.addEventListener('load', function () {
                    parent.classList.add('loaded');
                    img.removeAttribute('loading')
                });
            }
        })
    }
}
lazyLoad()
// fadeUp animation
function animate() {
    const elements = document.querySelectorAll('[data-animation]');
    elements.forEach(async item => {
        const itemTop = item.getBoundingClientRect().top;
        const itemPoint = Math.abs(window.innerHeight - item.offsetHeight * 0.1);
        const itemScrolled = itemPoint > 100 ? itemPoint : 100;
        if (itemTop - itemScrolled < 0) {
            const animName = item.getAttribute("data-animation");
            if (preloader && !preloader.classList.contains("loaded")) {
                await new Promise(resolve => setTimeout(resolve, preloaderHiddenTimeOut));
            }
            item.classList.add(animName);
            item.removeAttribute("data-animation");
        }
    });
}
animate()
window.addEventListener('load', animate)
window.addEventListener("orientationchange", animate)
window.addEventListener("scroll", animate)
//menu
if (menuOpenBtn && menuCloseBtn && mobMenu) {
    menuOpenBtn.addEventListener("click", () => {
        mobMenu.classList.add("show")
        disableScroll()
    })
    menuCloseBtn.addEventListener("click", () => {
        mobMenu.classList.remove("show")
        enableScroll()
    })
    window.addEventListener("resize", () => {
        if (window.innerWidth > bp.desktop && mobMenu.classList.contains("show")) {
            menuCloseBtn.click()
        }
    })
}
// pageUp
const pageUp = document.querySelector(".page-up")
if (pageUp) {
    pageUp.addEventListener("click", () => window.scrollTo({ top: 0, behavior: 'smooth' }))
}
