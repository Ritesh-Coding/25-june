from django.db import models

# create by chirag


class Holiday(models.Model):
    name = models.CharField(max_length=255)
    date = models.DateField()

    def __str__(self):
        return self.name