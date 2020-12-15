export default class Analytics{
    static trackEvent (...args){
        Analytics.trackMixpanelEvent(args)
        Analytics.trackSegmentEvent(args)
    }

    static trackMixpanelEvent (...args){

    }

	static trackSegmentEvent(...args) {}

    }

}