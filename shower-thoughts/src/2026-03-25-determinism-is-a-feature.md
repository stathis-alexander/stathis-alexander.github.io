# Determinism is a Feature

A function `f(x)` from a set `X` to a set `Y` is an assignment to each element of `X` exactly one element of `Y`. The key point is the _determinism_: if you put in `x`, and you get out `y`, then you know that the next time you put in `x`, you'll still get out `y`. Do it one hundred times, still `y` is returned. If you give `f(x)` to a friend, and they put in `x`, they also get `y`. The determinism is a feature.

In engineering, deterministic systems are easier to reason about because they're more predictable, which makes them easier to maintain. Determinism makes them easier to debug when something does go wrong. It makes it simpler for users and customers to know what will happen when they take actions, even making new or unfamiliar actions predictable as well. Building deterministic systems is why we have best practices like _idempotency_, _thread-safety_, and _cache busting_.

AI, however, is naturally _non-deterministic_. Ask Claude the same thing twice and it will produce different responses. That's _also a feature_, since if a human is asking the same question over again, they're likely after a different explanation. But that makes AI ill-suited to building deterministic systems.

The question here is: as we replace more software with agents & AI, what are the right places to use agents and what are the right places to build software?

I'd argue that the optimization function is determinism (and maybe the cost of achieveing it?):
* Need deterministic outcomes based on a set of key inputs? Good-ole'-fashioned software.
* Have ambiguous workflows where the result needs to fluctuate based on the context? Sounds agentic.

I think the elephant in the agents-will-replace-us-and-everything-else-too room is that agents are just not good at solving for deterministic outcomes. It makes sense, since at their core they're basically chains of matrices multiplied together with randomization inserted. Engineers are already tasked with picking the right tools for the right problems. The difference in the future is just which tools we have available. Is this an agentic task? Is this something we should just build and ship software to solve? How do we "glue" the two together for a seamless experience for the customer? Of course, there are contextual trade-offs and constraints that dictate some of the outcomes, and the same will be true in the future.
