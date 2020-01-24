"""Django portfolio app views."""
from django.shortcuts import render
from django.views.generic import DetailView, TemplateView
from .models import Project, Photo
# from django.db.models import Prefetch


# def index(request):
#     """Index render request."""
#     return render(request, 'index.html')


class ProjectDetail(DetailView):
    """Individual project views."""

    model = Project
    template_name = 'project_detail.html'

    def get_context_data(self, **kwargs):
        """Context adds list of photos relating to project."""
        context = super().get_context_data(**kwargs)
        # don't define context_object_name or this won't work
        context['photo_list'] = Photo.objects.filter(project=self.object)
        context['photo_list'] = context['photo_list'].order_by('filename')
        return context

    # could prefetch but then can't order by


class HomeView(TemplateView):
    """Home page view."""

    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        """List of photos relating to project."""
        context = super().get_context_data(**kwargs)
        # context['project_list'] = Project.objects.values(
        #     'id', 'title', 'slug', 'order', 'thumb'
        # )
        # context['project_list'] = Project.objects.order_by('order')
        # context['project_list'] = Project.objects.order_by(
        #     'order').values('id', 'title', 'slug', 'order', 'thumb')
        context['project_list'] = Project.objects.order_by(
            'order').only('id', 'title', 'slug', 'order', 'thumb')
        return context

    # values('project__')
