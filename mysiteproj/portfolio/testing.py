from .models import Project, Photo
from .decorators import debugger_queries
from django.db.models import Prefetch

# def photo_order():


def projects_list():
    """
    Testing function with prefetch.

    https://medium.com/@lucasmagnum/djangotip-select-prefetch-related-e76b683aa457

    """
    covers_qs = Photo.objects.filter(
        is_cover=True).select_related('project')
    projects_qs = Project.objects.prefetch_related(Prefetch(
        'photos',
        queryset=covers_qs,
        to_attr='covers_list'
    ))

    projects = []

    for project in projects_qs:
        projects.append({
            'id': project.id,
            'title': project.title,
            'cover': project.covers_list[0].filename
        })

    return projects


def debug_projects_list():
    """Debug function wrapper."""
    return debugger_queries(projects_list)()


def limit_list():
    covers_qs = Photo.objects.filter(
        is_cover=True).select_related('project')
    projects_qs = Project.objects.prefetch_related(Prefetch(
        'photos',
        queryset=covers_qs,
        to_attr='covers_list'
    )).values("id", "title", "slug", )
# "photos__id", "photos__filename"
    # projects = []

    # for project in projects_qs:
    #     projects.append({
    #         'id': project.id,
    #         'title': project.title,
    #         'slug': project.slug,
    #         'cover': project.covers_list[0].filename

    #     })

    # return projects
    return projects_qs


def debug_limit_list():
    """Debug function wrapper."""
    return debugger_queries(limit_list)()
