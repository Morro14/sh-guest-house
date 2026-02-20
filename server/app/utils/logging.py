import logging


class DropRequestInfoLogs(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        print("LOGGING FILTER")
        event = getattr(record, "event", None)

        if event in ["request_started", "request_finished"]:
            return False
        return True
