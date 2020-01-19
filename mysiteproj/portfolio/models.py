from django.db import models


class Project(models.Model):
    """Model class for portfolio projects."""

    title = models.CharField(max_length=100, unique=True)
    # how was the idea implemented technically
    technical_desc = models.TextField(default="technical")
    # overview of idea and pre-thoughts
    overview_desc = models.TextField(default="overview")
    # better model field for this?  one to store tuples
    tech_list = models.CharField(max_length=100)
    # could automate this in Admin model
    slug = models.SlugField(unique=True)
    # set to high number and change in admin  default necessary?
    order = models.PositiveSmallIntegerField(default=40, unique=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title

# def get_image_path(instance, filename):
#     """C'mon.  Seriously."""
#     return '/'.join(['project_images', instance.project.slug, filename])


class Photo(models.Model):
    """Model class for all project images."""

    # Keep entire url path no more than 200 chars
    filename = models.CharField(max_length=100, unique=True)
    # if delete project it will delete all associated photos
    project = models.ForeignKey(
        Project, related_name="photos", on_delete=models.CASCADE
    )
    caption = models.CharField(max_length=100)
    is_cover = models.BooleanField()

    # def image_url(self):
    #     """Return custom image url."""
    #     image_url = static("imgs/{}.jpg".format(self.filename))
    #     return image_url

    # instead of this, order by in queryset, order by filename
    # organize is on naming conventions
    # don't need order when only getting covers
    # class Meta:
    #     ordering = ["order"]


# coding style order: choices, db fields, custom manager, class meta
# def __str__(), def save(), def get_absolute_url(), custom methods
