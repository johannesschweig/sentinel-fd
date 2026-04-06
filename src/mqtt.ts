export async function sendMessage(id: string, state: string) {
  console.log(`📤 Sending command to backend: ${id} -> ${state}`);
  const URL = import.meta.env.VITE_API_URL
  await fetch(`${URL}/api/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      arm_state: state
    })
  });
}