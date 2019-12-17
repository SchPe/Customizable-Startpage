# A Customizable Browser Start Page

This is a website that allows the user to display and arrange content from various sources and thus can serve as a customizable browser start page. Because of the features it provides for desktop computers (free positioning through drag and drop) that are difficult to translate to mobile devices and vice versa, instead of responsive design it uses two different UIs for desktop and mobile devices while still reusing as much existing code as possible to keep it DRY.

In order to sync content across different devices, the user is able to register an account and log in, which will automatically store his content data on the server and keep it up to date.

Apart from that, the website is designed to work mostly independent of the server and can also be used as a progressive web app, enabling the user to install the site like an app and access it even while offline. To achieve this, both data stored in the local storage and from a service worker are combined to recreate the user’s custom configuration and respective content.
## Design

The website is designed to function mostly serverless, and except for the news API, all APIs are directly accessed by the client. As a result, the bulk of the functionality is in the client, which will be the focus here.

### HMVC architecture

As the general architecture of the client, a HMVC like pattern was chosen, a hierarchical extension of the MVC pattern (which is also used by the server). The MVC pattern knows three distinct types of components:

*View*: Concerned only with displaying content to the user and possibly also listening for user input. Any business logic is mostly kept out of it. In the case of clientside web applications (like in this case), views are usually the only components that have access to the DOM.

*Model*: Concerned with providing data to the other components, often they also contain business logic. If the application needs to access a data base or make ajax calls, that's usually done in a model component.

*Controller*: Reacts to user input and serves as a bridge between the model and the view, thus decoupling them from each other and simplifying both through separation of concerns.

This general pattern is implemented in this application in the following way:

- All components (except content views, see below) are singletons.

- The projects gets its (two-layered) hierarchical structure by using a MainController and a MainView.

- The MainController initialises all other controllers as its children, and this way controls all the other components of the application, either directly or through its subcontrollers.

- The MainView is responsible for initializing all other views and manages how they are arranged on the page. It's the only component that differs between the desktop version and mobile version of the website (there is a DesktopMainView class and a SmartphoneMainvView class which both inherit from the abstract MainView superclass). To allow for the necessary flexibility to use different MainView classes, the MainView object ist injected into the MainController by dependency injection.

- The MainController generally only commands the MainView and leaves the control of the subviews to its subconcrollers. It also generally only listens to events fired by the MainView. An exception to this rule is made for some views for performance reasons, in order to be able to lazy load certain sub controllers only when they're needed.

- There are two kinds of subviews: content views (or simply views) and query views. Each type of content that the website can display (github, reddit, etc.) has its own content view class and query view class. The query view is responsible for listening and collecting input data by the user to create new content. The content view is responsible for displaying the content requested by the user and can also listen for additional user input.

- For each type of content and query view there is one controller. The controller initializes the respective model, validates requests sent by the query view and assigns data from the model to a content view. It also reacts to further user input on a content view that it's responsible for.

- Controllers can also make use of a couple of other modules that add functionality and logic (for further separation of concerns and to keep the logic in the controller itself slim). DataFormatters for example are used to convert raw data from the model to a simpler format that can be immediately displayed by the view.

- Apart from that some Controllers that deal with views also maintain information about the views they manage in a mapping, which corresponds to the ViewModel in the MVVM architecture pattern. Therein information relevant to the controller about the state of a view is stored, like for example which page of the data provided by the model is currently displayed.

- The CacheController is a special kind of Controller that stores and retrieves configuration data from the local storage. The configuration data stores what kinds of views the user has opened, how they're positioned on the website etc. and is also sent to the server if the user is logged in.

### Data Flow and Publish Subscribe Pattern

Controllers know about the views and models they need to control and can directly command them. In contrast, views and models are oblivious to the existence of other components. Since views however are ideally the only components with access to the DOM tree and thus the only components that can listen for user input, there needs to be a way for views to communicate user actions to their respective controllers. To achieve this, the publish subscribe pattern is used.

The publish subscribe pattern is implemented through the events singleton, which is imported and used by all controllers and views. It allows components to publish and subscribe to different event types, which are semantically named to make the code easier to understand. The publish method takes two arguments, the event type and additional data that a subscriber needs to process the event. The subscribe method likewise takes two arguments, the event type and a handler method that will be called with the supplied data once the event fires. So if for instance a user presses a button to create new content, the view can publish the event "content required" together with form data that the user has previously provided to determine which type of content is requested. If a controller has subscribed to this event, the handler that was provided upon subscription will then be called with the supplied data of the publisher as the argument.

This way the controllers are the only components that know and depend on other components of the system, the views in contrast are only loosely coupled just like the models. Should either the views or models need to change, only the respective controllers would need to adapt, the rest of the system remains unaffected. Another advantage of this is that it's possible to reuse the models and views in entirely different contexts and applications.

### Extensions and Plugins

The website is designed to be easily extendable with minimal modifications to existing code, adhering to the open-closed principle. The plugins.js file is the central location where all types of views and controllers are imported and then automatically exported everywhere throughout the project. If one wanted to add another view type, like for example twitter, one would merely need to write the necessary components (model, controller, content view, query view), create the necessary form input elements in the markup and then import and register the components into the plugins.js file. Apart from that nothing needs to be changed in the existing codebase.

Likewise, if one wanted to create a new UI specifically for tablets, one would merely need to add a new MainView subclass and inject it into the MainController through dependency injection. Depending on the view structure and features of the new MainView one might want to create new event types and add code to the CacheController, but apart from that nothing else is required. Well, apart from detecting tablets through user agent sniffing, which is more complicated admittedly..

### Testing

The MVC architecture lends itself well to tdd approaches and testing in general. Since the views contain no business logic at all and only concern themselves with rendering their content and the UI, bugs in the UI must generally be located in the views, while bugs in the business logic must stem from the model or one of the other business logic modules used by the controller. Because of the loose coupling the components are easily testable in isolation. Views can in some cases be skipped entirely in unit tests, since the controller maintains a kind of view model variable which represents the abstract state of the view anyway.

### Usability

Sites which allow to create, arrange and manipulate UI elements freely are uncommon and will strike less adept users as arcane. To mitigate this, the welcoming screen links to introductory videos that give a very quick overview over the basic functionality. 

The UI to create new content is hidden within a modal that only popups after clicking the plus button. It would have been possible to draw these controls outside of the modal and place them more visibly on the page. However, it's expected that the user will only need to create new content in rare cases. At the beginning when he first creates his individual start page and after that from time to time when he wants to make modifications. Most often the startpage will simply remain as it is, as making modifications to it all the time would defeat its purpose. Having the site on the other hand cluttered with UI controls would detract from the experience of a blank slate canvas which can be freely filled with content.
In fact, in the desktop version of the site it's even possible to let content views overlap the navigation bar, so that the whole visible screen is filled with user created content. 

While the desktop and mobile version of the site are very similar and share largely the same UI components, there are differences in how the content views are displayed and how they can be manipulated, to optimize the use for different devices. 

*Desktop Version*: 
Offers complete freedom how the user places the content through drag and drop as well as resize.
Auto snapping of content elements makes it easy to place them next to each other without any gaps. 

*Mobile Version*:
Because of the limited screen size, only one content view can be displayed at a time. The goal then is to make the navigation between the content views smoother than the navigation between browser tabs.
The different content views are displayed within an accordion as collapsible bars and can be put in an arbitrary order by the user. Once expanded, the header of the expanded content view becomes sticky. That way it's easy to collapse the view through the header no matter how far one scrolls down. The header remains on the screen semitransparent. 

By making use of the PWA functionality the user can access the site as its own app, instead of it being just another tab in the browser. Users nowadays tend to surf with many tabs open and navigating to the startpage tab can be cumbersome, so having access to the start page as a distinguished hub through an app has some utility in itself.
The main purpose of the PWA technology however is to give the site an app like feeling, instant loading times and availability even while offline. 

### Lessons learned during development
Next time I'd use TypeScript for a project like this. I've used inheritance a lot throughout the project, JavaScript makes this spongier by providing no abstract classes or methods and no static type system. Even private variables and methods, while possible to implement through contrived constructs have no direct support in the language (although this is about to change). 

A front end framework like React or Angular would have saved a lot of work as well by providing a preexisting architecture. Using pure JavaScript I had to come up with a good way to structure the code myself, which was a valuable exercise though. 


## Where to go from here (hypothetically)

If I wanted to pursue this project and make it available to the general public, additional steps would be required. 

The News API component requires an API key which is why all requests need to go through the server. The free service of News API allows for a maximum of 500 requests per day, which is of course not enough given a large enough user base. Thus it would be necessary to either remove it completely or to upgrade to the next tier. The latter option could be funded by making the News API component a paid feature within the start page site that needs to be unlocked first. 

Legally, if I wanted to operate the site commercially, I'd also have to ask the other API owners (Reddit, Github) for permission. 
Furthermore, European law demands that the use of cookies, which I'm currently using to identify logged in users, requires user consent, so I need to handle this as well. 

With these basic legal matters out of the way, additional features could be built in to make the site more attractive: 

- Login through Google and/or Facebook, to save users the hassle of coming up and remembering a separate password for the site. 
- Using additional APIs to give the user even more kinds of content to display. Twitter and Facebook come to mind in particular. 
- Providing even more options for customization, like background color, background image, font and font size etc.
- There could also be the option to store several startpage configurations at once and to switch freely between them. With that in place, one could go even further and make it possible to publish configurations, enabling users to share their individual startpages with each other. 

In addition to that, user feedback through an external site, where users can propose and vote on new features seems like a good idea, assuming I have enough time to further improve the site. 

### Profitability

Operating the site commercially requires the permissions of the various API owners. To circumvent this, one could simply rely on donations (for example via Patreon), which might or might not be enough to cover the maintenance costs. 

There is however great potential for targeted advertisement. The start page configuration (the kind of content that is displayed), gives much away about a user's interests. Given sufficient analytics expertise, one could extract relevant information from the data and find the right ads to match a given user's interests. 

Getting users in the first place is another problem. One way to go about this might be to create default startpage configurations for different interest groups, which one could then advertise to those groups in niche websites and subreddits. Apart from that, doing better SEO is of course always an option, just like choosing a catchy domain name. 


### Maintenance

Currently the site runs on a Heroku hobby dynamo for up to 7$ per month. If the amount of users were to increase, it would be possible to upgrade to the next tier on Heroku or switch to AWS for a slightly cheaper price. In both cases load balancing can be comfortably handled through the cloud. 
Apart from Heroku, the site also uses Mongo Atlas as its database server and Sendgrid as its email service, the free tier respectively. Both would require upgrades to handle a larger userbase.

Functionally the site is straightforward with simple features that are independent from each other and don't require much business logic. The way it is, it would be overkill to spent time building a more sophisticated DevOps infrastructure. 
There's also no need to produce content for the user, as the site's entire purpose is to integrate content from external sources into one compact view. 



