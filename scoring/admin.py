from django.contrib import admin

from scoring.models import UserWeight, LeaderboardEntry, Score


@admin.register(UserWeight)
class UserWeightAdmin(admin.ModelAdmin):
    search_fields = ["user"]


@admin.register(LeaderboardEntry)
class LeaderboardEntryAdmin(admin.ModelAdmin):
    search_fields = ["user", "project"]
    autocomplete_fields = ["user"]


@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    search_fields = ["user", "for_question"]
    autocomplete_fields = ["user", "question"]
