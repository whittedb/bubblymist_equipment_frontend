import Vue from 'vue'

export default Vue.directive('facebook-signin-button', {
    bind: function (el, binding, vnode) {
        CheckComponentMethods()
        let appId = binding.value
        let facebookSignInAPI = document.createElement('script')
        facebookSignInAPI.setAttribute('src', '//connect.facebook.net/en_US/sdk.js')
        document.head.appendChild(facebookSignInAPI)

        facebookSignInAPI.onload = InitFacebookButton

        function InitFacebookButton() {
            // eslint-disable-next-line no-undef
            FB.init({
                appId: appId,
                xfbml: true,
                version: 'v3.1'
            })
            // eslint-disable-next-line no-undef
            FB.logout()
        }

        el.addEventListener('click', PopUp)

        function PopUp() {
            // eslint-disable-next-line no-undef
            FB.login(function (facebookResponse) {
                if (facebookResponse.status === 'connected') {
                    OnSuccess(facebookResponse.authResponse.accessToken)
                } else {
                    Onfail()
                }
            }, {scope: "public_profile,email"})
        }
        function OnSuccess(token) {
            vnode.context.OnFacebookAuthSuccess(token)
        }
        function Onfail() {
            vnode.context.OnFacebookAuthFail('Facebook sign-in failed')
        }
        function CheckComponentMethods() {
            if (!vnode.context.OnFacebookAuthSuccess) {
                throw new Error('The method OnFacebookAuthSuccess must be defined on the component')
            }

            if (!vnode.context.OnFacebookAuthFail) {
                throw new Error('The method OnFacebookAuthFail must be defined on the component')
            }
        }
    }
})
