# Structured JSON logger for FastAPI
import logging
import uuid
from pythonjsonlogger import jsonlogger

# Create a logger
logger = logging.getLogger("disasterflow")
logger.setLevel(logging.INFO)

logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter(
    "%(asctime)s %(levelname)s %(name)s %(message)s %(request_id)s",
    rename_fields={"asctime": "timestamp", "levelname": "level"},
)
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)

# Middleware to inject a request_id into log records
class RequestIdFilter(logging.Filter):
    def filter(self, record):
        if not hasattr(record, "request_id"):
            record.request_id = getattr(record, "request_id", "-")
        return True

logger.addFilter(RequestIdFilter())

def get_logger(request):
    # Attach request_id to the logger for the current request
    request_id = request.state.request_id
    return logging.LoggerAdapter(logger, {"request_id": request_id})
