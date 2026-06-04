import logging


class DropRequestInfoLogs(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        event = getattr(record, "event", None)

        if event in ["request_started", "request_finished"]:
            return False
        return True


def shorten_exception(logger, method_name, event_dict):
    """Replaces a full stack trace with a simple error summary."""
    # Check if an exception was processed
    print("SHORTEN EXCEPTION MSG")
    if "exception" in event_dict:
        # If format_exc_info ran, 'exception' is a long string.
        # We can look at the actual sys.exc_info() if available,
        # or just grab the first line of the formatted exception.
        exc_lines = event_dict["exception"].strip().split("\n")
        if exc_lines:
            # The last line of a traceback usually contains "ErrorName: message"
            event_dict["error_summary"] = exc_lines[-1]

        # Drop the massive traceback
        del event_dict["exception"]

    return event_dict
