export const getSlackChannelValues = (channels: { name: string; id: string }[] | null) => {
	if (!channels) return [];

	return (
		channels.map((channel) => {
			return { label: channel.name, value: channel.id };
		}) ?? []
	);
};