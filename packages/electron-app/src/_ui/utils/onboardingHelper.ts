export class OnboardingHelper {
    static showAssertInfoContent(tour) {
        setTimeout(() => {
            const out = (window as any)._createNewElementAssertionRow();
            if(out) return;
                // Try until window._createNewElementAssertionRow() returns true (timeout after 5s)
            const maxTimeout = 5000;
            const interval = 100;
            let timeout = 0;
            const intervalId = setInterval(() => {
                if (timeout >= maxTimeout) {
                    clearInterval(intervalId);
                }
                if ((window as any)._createNewElementAssertionRow()) {
                    clearInterval(intervalId);
                    tour.next();
                }
                timeout += interval;
            });
        }, 500);
    }
}