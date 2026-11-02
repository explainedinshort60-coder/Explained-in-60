# Explained in 60

Automated 60-second loop explainer Shorts. A scheduled agent follows `RUNBOOK.md` to research, script, draw, animate, voice and queue one episode per run.

- `engine/`: rig, render core, build pipeline (`python3 engine/build.py episodes/<id>`)
- `episodes/<id>/`: one folder per episode (props.js, episode.py, script.md, research.md, meta.json)
- `topics.md`: backlog and log
- `config.json`: Metricool brand, slots, approval mode
