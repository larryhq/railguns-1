from django.db import models
from django.utils.translation import gettext_lazy as _

from .utils import db_master, generate_shard_id, get_user_id


class DateTimeModelMixin(models.Model):
    id = models.PositiveIntegerField(primary_key=True, editable=False)
    created_time = models.DateTimeField(_('created_time'), auto_now_add=True)
    updated_time = models.DateTimeField(_('updated_time'), auto_now=True)

    class Meta:
        abstract = True


class BaseModel(DateTimeModelMixin):
    is_active = models.BooleanField(_('active'), default=True)
    objects = models.Manager()  # 只是为了PyLint不警告, SO: https://stackoverflow.com/questions/45135263/class-has-no-objects-member/45150811#45150811

    class Meta:
        abstract = True
        ordering = ['-pk']


class OwnerModel(BaseModel):
    user_id = models.PositiveIntegerField(default=0, editable=False)
    username = models.CharField(max_length=150, editable=False)  # 长度和Django的User保持一致
    user_images = models.CharField(_('images'), max_length=2000, blank=True, editable=False)

    class Meta(BaseModel.Meta):
        abstract = True


class PostModel(OwnerModel):
    """内容发布类模型"""
    title = models.CharField(_('title'), max_length=255)
    summary = models.CharField(_('summary'), max_length=2000, blank=True)
    images = models.CharField(_('images'), max_length=2000, blank=True)
    tags = models.CharField(_('tags'), max_length=255, blank=True)

    class Meta(OwnerModel.Meta):
        abstract = True

    def __str__(self):
        return self.title


class ShardModel(OwnerModel):
    id = models.BigAutoField()

    class Meta(OwnerModel.Meta):
        abstract = True

    def save(self, using='default', *args, **kwargs):
        self.full_clean()
        if not self.pk:
            self.pk = generate_shard_id(self.user_id)
        super().save(using=db_master(self.user_id), *args, **kwargs)


class ShardLCModel(OwnerModel):
    id = models.BigAutoField()
    is_origin = models.BooleanField(default=True)

    class Meta(OwnerModel.Meta):
        abstract = True

    def save(self, using='default', *args, **kwargs):
        self.full_clean()
        if not self.pk:  # Create
            self.pk = generate_shard_id(self.user_id)
        super().save(using=db_master(self.user_id), *args, **kwargs)  # 保存第一份
        card_user_id = get_user_id(self.card_id)
        if db_master(card_user_id) != db_master(self.user_id):  # 保存第二份
            self.is_origin = False
            super().save(using=db_master(card_user_id), *args, **kwargs)
