from django import template

register = template.Library()


@register.filter
def model_verbose_name(obj):
    print("verbose name filter", obj._meta.verbose_name)
    return obj._meta.verbose_name
