export default () => ({
    isMobile: (window.innerWidth < 768) ? true : false,
    showDrawer: false, 
    drawerTab: '', 
    showNav: false, 
    showBack: false, 
    showMenu: false, 
    showFilters: false,
    zoomView: false,
    lockScroll: false,
    hideGlobalBanner: sessionStorage.getItem('globalBanner') === 'hidden',
    hideSignUpBanner: true,
    showInfo: '',
    blackout: false
})