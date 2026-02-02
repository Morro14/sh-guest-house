from django.conf import settings


def _get_language_from_request(request):
    # Explicit ?lang= parameter takes priority
    if lang := request.GET.get("lang"):
        return lang

    # Then check the Accept-Language header
    header = request.META.get("HTTP_ACCEPT_LANGUAGE", "")
    if header:
        # Example header: "ru,en;q=0.8,hy;q=0.5"
        langs = [h.split(";")[0].strip() for h in header.split(",")]
        for lang in langs:
            short = lang.split("-")[0]
            if short in dict(settings.LANGUAGES):
                return short

    # Fallback
    return settings.LANGUAGE_CODE
