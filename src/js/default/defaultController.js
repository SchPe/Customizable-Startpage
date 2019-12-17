
const content = 
    `
    <div class="m-4"  >
        <h3 class="text-center mb-3">Welcome</h3>
        <p> 
            This is a website that allows you to display and arrange content from various different sources, thus enabling you to build your own personal start page.
        </p>
        <p> 
            For a quick overview how to use the site you can watch the following very short introduction videos:
        </p>
        <p class="mb-1">
            <a class="text-danger" href="https://youtu.be/WhAekpw_YoQ" target="_blank">
                How to use the desktop version
            </a>
        </p>
        <p >
            <a class="text-danger" href="https://youtu.be/ExRDDVMf57U " target="_blank">
                How to use the mobile version
            </a>
        </p>
        <p> 
            In order to sync your start page across multiple devices, please register an account and log in. 
        </p>

        <p> 
            If you want to use the site like an app and have a compatible browser (most browsers don't support this), click "add to home screen", which will install the site on your device. You might need to use the website for a while in order for the "add to home screen" button to show up.  
        </p>

        <p> Enjoy your stay!</p>
    </div>
    
    `;

export default class DefaultController {

constructor() {

}

    async showContent(view, query) {
        view.showContent(content)
    }

    attachView() {
        return
    }
}
