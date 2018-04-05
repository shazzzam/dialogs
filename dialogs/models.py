from django.db import models
from django.urls import reverse


class Group(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def delete_link(self):
        return reverse('api-dialogs:groups-delete', kwargs={'pk': self.pk})

    def update_link(self):
        return reverse('api-dialogs:groups-update', kwargs={'pk': self.pk})


class Question(models.Model):
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    group = models.ForeignKey(
        'Group',
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )

    def __str__(self):
        return self.text[:200]


class Answer(models.Model):
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    question = models.ForeignKey(
        'Question',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    outcome = models.ForeignKey(
        'Question',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='income',
    )

    def __str__(self):
        return self.text[:200]
