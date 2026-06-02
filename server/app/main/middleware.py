import structlog

from django.utils import translation

log = structlog.get_logger()


class RequestLanguageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        lang_url_param = request.GET.get("lang", None)
        lang_header_param = request.headers.get("x-language")
        lang = lang_url_param or lang_header_param or "en"
        print("LANGUAGE", lang)
        translation.activate(lang)
        request.LANGUAGE_CODE = lang
        structlog.contextvars.bind_contextvars(language=lang)

        response = self.get_response(request)
        return response


def get_client_ip(request):
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    if xff:
        return xff.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


class ClientIPMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.client_ip = get_client_ip(request)
        return self.get_response(request)
