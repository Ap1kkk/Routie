import React, { useState } from 'react';
import { RegistrationForm1 } from '../RegistrationForm1';
import { RegistrationForm2 } from '../RegistrationForm2';
import { RegistrationForm3 } from '../RegistrationForm3';

import { useNavigate } from 'react-router-dom';

interface RegistrationData {
	email: string;
	password: string;
	avatar: File | null;
	name: string;
	gender: string;
	birthDate: string;
	weight: number;
	height: number;
	tags: string[];
}

export const RegistrationForm: React.FC = () => {
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState<RegistrationData>({
		email: '',
		password: '',
		avatar: null,
		name: '',
		gender: '',
		birthDate: '',
		weight: 0,
		height: 0,
		tags: [],
	});

	const handleNextStep1 = (data: { email: string; password: string }) => {
		setFormData((prev) => ({ ...prev, ...data }));
		setStep(2);
	};

	const handleUpdateData = (key: string, value: unknown) => {
		setFormData((prev) => ({ ...prev, [key]: value }));
	};

	const handleNextStep2 = () => {
		setStep(3);
	};

	const handleComplete = (data: { tags: string[] }) => {
		const completeData = { ...formData, ...data };
		console.log('Регистрация завершена:', completeData);
		navigate('/routie');
	};

	const handleBack = () => {
		setStep((prev) => prev - 1);
	};

	return (
		<>
			{step === 1 && (
				<RegistrationForm1
					onNext={handleNextStep1}
					initialData={{
						email: formData.email,
						password: formData.password,
					}}
				/>
			)}

			{step === 2 && (
				<RegistrationForm2
					data={{
						name: formData.name,
						gender: formData.gender,
						birthDate: formData.birthDate,
						weight: formData.weight,
						height: formData.height,
						avatar: formData.avatar,
					}}
					updateData={handleUpdateData}
					onNext={handleNextStep2}
					onPrev={handleBack}
				/>
			)}

			{step === 3 && (
				<RegistrationForm3
					onComplete={handleComplete}
					onBack={handleBack}
					initialData={{ tags: formData.tags }}
				/>
			)}
		</>
	);
};
