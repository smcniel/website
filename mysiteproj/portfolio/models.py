from django.db import models
from django.urls import reverse
# import ast


class Project(models.Model):
    """Model class for portfolio projects."""

    title = models.CharField(max_length=100, unique=True)
    # how was the idea implemented technically
    technical_desc = models.TextField(default="technical")
    # overview of idea and pre-thoughts
    overview_desc = models.TextField(default="overview")
    # better model field for this?  one to store tuples
    tech = models.CharField(max_length=100)
    # could automate this in Admin model
    slug = models.SlugField(unique=True)
    # set to high number and change in admin  default necessary?
    order = models.PositiveSmallIntegerField(default=40, unique=True)
    # not ideal, but easier for queries to put attribute on project
    thumb = models.CharField(max_length=100, unique=True)

    # class Meta:
    #     ordering = ["order"]

    def __str__(self):
        """Magic."""
        return self.title

    def get_absolute_url(self):
        """Return url with project slug."""
        return reverse('project-detail', kwargs={'slug': self.slug})

    def _get_tech_list(self):
        if self.tech:
            tech_list = self.tech.split(",")
            return tech_list

    tech_list = property(_get_tech_list)

    def __unicode__(self):
        """Magic."""
        return self.tech_list


# def get_image_path(instance, filename):
#     """C'mon.  Seriously."""
#     return '/'.join(['project_images', instance.project.slug, filename])


class Photo(models.Model):
    """Model class for all project images."""

    # Keep entire url path no more than 200 chars
    # filename does NOT have full path with ext
    # extra fields for srcset dif image sizes
    filename = models.CharField(max_length=40, unique=True)
    image_sm = models.CharField(max_length=100, unique=True)
    image_med = models.CharField(max_length=100, unique=True)
    image_lg = models.CharField(max_length=100, unique=True)
    # if delete project it will delete all associated photos
    project = models.ForeignKey(
        Project, related_name="photos", on_delete=models.CASCADE
    )
    caption = models.CharField(max_length=100)

    # def image_url(self):
    #     """Return custom image url."""
    #     image_url = static("imgs/{}.jpg".format(self.filename))
    #     return image_url
    def __str__(self):
        """Magic."""
        return self.filename

    # TO DO: custom validator for filenames/ url validate/ check match

# coding style order: choices, db fields, custom manager, class meta
# def __str__(), def save(), def get_absolute_url(), custom methods
