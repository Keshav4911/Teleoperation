from django.db import models

class Robot(models.Model):
    name = models.CharField(max_length=100)
    model_name = models.CharField(max_length=100)
    pose_x = models.FloatField(default=0)
    pose_y = models.FloatField(default=0)

    def __str__(self):
        return self.name

class Mission(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    robot = models.ForeignKey(Robot, on_delete=models.CASCADE)

    def __str__(self):
        return self.name