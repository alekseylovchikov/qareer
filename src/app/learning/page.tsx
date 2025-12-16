import {
  addSkill,
  addLearningGoal,
  getSkills,
  toggleGoalCompletion,
  deleteSkill,
} from "@/app/actions/learning";
import { Button } from "@/app/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";
import { Trash2, CheckCircle, Circle } from "lucide-react";

export default async function LearningPage() {
  const skills = await getSkills();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Learning Track
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Upgrade your skills to match your dream jobs.
        </p>
      </div>

      {/* Add Skill Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Skill</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={addSkill}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
          >
            <div className="md:col-span-4">
              <Input
                name="name"
                label="Skill Name"
                placeholder="e.g. Next.js, System Design"
                required
              />
            </div>
            <div className="md:col-span-2">
              <Input
                name="currentLevel"
                label="Current"
                placeholder="Beginner"
              />
            </div>
            <div className="md:col-span-2">
              <Input name="targetLevel" label="Target" placeholder="Mastery" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Priority
              </label>
              <div className="relative">
                <select
                  name="priority"
                  className="flex h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 appearance-none"
                  defaultValue="5"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full">
                Add Skill
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {skills.map((skill) => (
          <Card key={skill.id} className="flex flex-col h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{skill.name}</CardTitle>
                  <div className="text-sm text-zinc-500 mt-1 flex gap-2">
                    <span>Cw: {skill.currentLevel || "N/A"}</span>
                    <span>→</span>
                    <span className="text-indigo-600 font-medium">
                      {skill.targetLevel || "Mastery"}
                    </span>
                  </div>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await deleteSkill(skill.id);
                  }}
                >
                  <button
                    type="submit"
                    className="text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Goals
                </h4>
                {skill.learningGoals.map((goal) => (
                  <div key={goal.id} className="flex items-start gap-2 group">
                    <form
                      action={async () => {
                        "use server";
                        await toggleGoalCompletion(goal.id, goal.isCompleted);
                      }}
                    >
                      <button
                        type="submit"
                        className={`mt-0.5 ${
                          goal.isCompleted
                            ? "text-green-500"
                            : "text-zinc-300 hover:text-zinc-400"
                        }`}
                      >
                        {goal.isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>
                    </form>
                    <span
                      className={`text-sm ${
                        goal.isCompleted
                          ? "text-zinc-400 line-through"
                          : "text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      {goal.title}
                    </span>
                  </div>
                ))}
                {skill.learningGoals.length === 0 && (
                  <p className="text-xs text-zinc-400 italic">No goals set.</p>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <form action={addLearningGoal} className="flex gap-2">
                  <input type="hidden" name="skillId" value={skill.id} />
                  <Input
                    name="title"
                    placeholder="Add goal..."
                    className="h-8 text-xs"
                    required
                  />
                  <Button
                    type="submit"
                    size="sm"
                    variant="secondary"
                    className="h-8"
                  >
                    Add
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
