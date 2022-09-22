import { notice, info, debug, error, warning, AnnotationProperties } from "@actions/core";

/** log to action console */
export class Logger {
    private constructor() {
        // private constructor to prevent instantiation
    }

    static log(message: any) {
        if (typeof message !== 'string') {
            message = JSON.stringify(message, null, 2);
        }

        info(message);
    }

    static info(message: any) {
        if (typeof message !== 'string') {
            message = JSON.stringify(message, null, 2);
        }

        info(message);
    }

    static debug(message: any) {
        if (typeof message !== 'string') {
            message = JSON.stringify(message, null, 2);
        }

        debug(message);
    }

    static notice(message: string | Error, props?: AnnotationProperties) {
        notice(message, props);
    }

    static err(message: string | Error, props?: AnnotationProperties) {
        error(message, props);
    }

    static warn(message: string | Error, props?: AnnotationProperties) {
        warning(message, props);
    }
}