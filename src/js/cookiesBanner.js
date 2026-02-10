export default () => ({
    cookieControl: false,
    showBanner: false,
    currentUserConsent: '',
    showBannerLocation: '',
    firstClick: true,
    delay: 0,
    consentKeys: ['preferences', 'analytics', 'marketing'],
    cookieBannerInit() {
        const self = this;
        window.Shopify.loadFeatures([{ name: 'consent-tracking-api', version: '0.1' }],
          function(error) {
            if (error) { throw error; }
            document.addEventListener("visitorConsentCollected", (event) => {
                // console.log(event.detail)
                if (event.detail.preferencesAllowed) { self.$refs.preferences.checked = true; } else { self.$refs.preferences.checked = false; }
                if (event.detail.analyticsAllowed) { self.$refs.analytics.checked = true; } else { self.$refs.analytics.checked = false; }
                if (event.detail.marketingAllowed) { self.$refs.marketing.checked = true; } else { self.$refs.marketing.checked = false; }
            });
            self.currentUserConsent = window.Shopify.customerPrivacy.currentVisitorConsent();
            self.showBannerLocation = window.Shopify.customerPrivacy.shouldShowBanner();    
            self.setBanner();
          }
        ); 
    },
    showSettings() {
        this.currentUserConsent = window.Shopify.customerPrivacy.currentVisitorConsent();
        for (let i = 0; i < this.consentKeys.length; i++) {
            let key = this.consentKeys[i];
            if (this.currentUserConsent[key] === 'yes') {
                this.$refs[key].checked = true;
            } else {
                this.$refs[key].checked = false;
            }
        }
    },
    setCookie(cookie) {
        const checkbox = this.$refs[cookie]
        if (checkbox.checked){
            window.Shopify.customerPrivacy.setTrackingConsent({[cookie]: true}, () => {});
        } else {
            window.Shopify.customerPrivacy.setTrackingConsent({[cookie]: false}, () => {});
        }
    },
    managePreferences() {
        if (this.firstClick) {
            window.Shopify.customerPrivacy.setTrackingConsent({"preferences": false, "analytics": false, "marketing": false}, () => {});
            this.firstClick = false;
        }
        this.cookieControl = true;
    },
    cookieAcceptAll() {
        window.Shopify.customerPrivacy.setTrackingConsent({"preferences": true, "analytics": true, "marketing": true}, () => {});
        if (this.cookieControl) { this.delay = 540 }
        setTimeout(() => {
            this.showBanner = false;
        }, this.delay);
    },
    cookieDecline() {
        window.Shopify.customerPrivacy.setTrackingConsent({"preferences": false, "analytics": false, "marketing": false}, () => {});
        if (this.cookieControl) { this.delay = 540 }
        setTimeout(() => {
            this.showBanner = false;
        }, this.delay);
    },
    setBanner() {
        if (window.location.port === '9292') {
            // console.log('Running under Shopify CLI development server');
        } else {
            if (this.consentKeys.every(key => this.currentUserConsent[key] === '') && this.showBannerLocation) {
                setTimeout(() => {
                    this.showBanner = true;
                }, 640);
            } else {
                this.showBanner = false;
            }
        }
    }
})