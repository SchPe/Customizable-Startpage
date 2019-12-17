
const root = process.cwd()

const fileLocations = {
    publicFolder: `${root}/dev/dev`,
    indexTemplate : `${root}/dev/dev/index.marko`,
    loginTemplate : `${root}/dev/dev/login.marko`,
    signupTemplate : `${root}/dev/dev/signup.marko`,
    signupSuccessTemplate : `${root}/dev/dev/signupSuccess.marko`,
    navContentLoggedOut: `${root}/dev/dev/loggedOutNavContent.txt`,
    navContentLoggedIn : `${root}/dev/dev/loggedInNavContent.txt`,
    resendTemplate: `${root}/dev/dev/resend.marko`,
    forgotTemplate: `${root}/dev/dev/forgot.marko`,
    resetTemplate: `${root}/dev/dev/reset.marko`,
}



module.exports = fileLocations