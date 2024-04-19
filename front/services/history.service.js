let routes = [];

module.exports = {
    getRouteHistory(){
        return routes;
    },
    pushRoute(r){
        routes.push(r);
    },
    isEmpty(){
    	return routes.length == 0;
    },
    getCurrentRoute(){
    	return routes.length > 0 ? routes[routes.length - 1] : null;
    },
    getPreviousRoute(){
        return routes.length > 1 ? routes[routes.length - 2] : null;
    }
};