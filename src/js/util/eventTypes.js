
const eventTypes = {
    newView: Symbol('newView'),
    validationRequired: Symbol('validationRequired'),
    newViewRequired: Symbol('newViewRequired'),
    viewClosed: 'viewClosed',
    loadMore: 'loadMore',
    markAsRead: Symbol('markAsRead'),
    markAllAsRead: Symbol('markAllAsRead'),
    githubAuthRequired: Symbol('githubAuthRequired'),
    countriesRequired: Symbol('countriesRequired'),
    sourcesRequired: Symbol('sourcesRequired'),
    drag: 'drag',
    resize: 'resize',
    changedZIndex: 'changedZIndex',
    sortUpdate: Symbol('sortupdate'),
    finishedLoading: Symbol('finishedLoading'),
    sendData: Symbol('sendData')
}

Object.freeze(eventTypes)

export default eventTypes

